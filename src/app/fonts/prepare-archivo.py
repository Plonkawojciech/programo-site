"""Build and verify the existing Archivo face; run in an isolated fontTools venv."""
import argparse
import hashlib
import json
from io import BytesIO
from pathlib import Path

import fontTools
import uharfbuzz as hb
from fontTools import subset
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

SOURCE_URL = "https://raw.githubusercontent.com/google/fonts/main/ofl/archivo/Archivo%5Bwdth,wght%5D.ttf"
SOURCE_SHA256 = "0e094a7d3c7c4c25cf1310c4b30014f1dae9332220b1c2c88f4fa996f0b05053"
FEATURES = ["rvrn", "ccmp", "locl", "mark", "mkmk", "rlig", "liga", "clig", "calt", "kern", "tnum"]
LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzĄĆĘŁŃÓŚŹŻąćęłńóśźż"
LOCATIONS = [
    {"wght": 600, "wdth": 100},
    {"wght": 700, "wdth": 108},
    {"wght": 100, "wdth": 62},
    {"wght": 900, "wdth": 125},
]


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def axes(font):
    return [(a.axisTag, a.minValue, a.defaultValue, a.maxValue) for a in font["fvar"].axes]


def sfnt(font):
    output = BytesIO()
    font.flavor = None
    font.save(output)
    return output.getvalue()


def shape(font, text, order, language, features):
    buffer = hb.Buffer()
    buffer.add_str(text)
    buffer.guess_segment_properties()
    buffer.language = language
    hb.shape(font, buffer, features)
    return [
        (order[g.codepoint], g.cluster, p.x_advance, p.y_advance, p.x_offset, p.y_offset)
        for g, p in zip(buffer.glyph_infos, buffer.glyph_positions)
    ]


def signatures(font, codepoints):
    glyphs = font.getGlyphSet()
    cmap = font.getBestCmap()
    result = {}
    for codepoint in codepoints:
        pen = DecomposingRecordingPen(glyphs)
        glyphs[cmap[codepoint]].draw(pen)
        result[codepoint] = (font["hmtx"][cmap[codepoint]], pen.value)
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("--extra-src", type=Path, action="append", default=[])
    parser.add_argument("--baseline-dir", type=Path)
    args = parser.parse_args()
    folder = Path(__file__).resolve().parent
    source_root = folder.parents[1]
    baseline = json.loads((folder / "baseline.json").read_text())
    assert sha(args.source) == SOURCE_SHA256, "Source font differs from verified Archivo version"
    original = TTFont(args.source, recalcTimestamp=False)
    available = set(original.getBestCmap()) & set(baseline["supported_codepoints"])
    lines = []
    scanned_files = 0
    for root in [source_root, *args.extra_src]:
        for path in sorted(root.rglob("*")):
            if path.suffix in {".ts", ".tsx", ".mdx"}:
                lines.extend(path.read_text().splitlines())
                scanned_files += 1
    seen = {ord(c) for line in lines for c in line}
    required = set(range(0x20, 0x7F)) | {ord(c) for c in LETTERS} | {0xA0, 0xA3, 0x20AC}
    codepoints = (seen & available) | required
    assert codepoints <= available
    local = TTFont(args.source, recalcTimestamp=False)
    options = subset.Options()
    options.name_IDs = ["*"]
    options.name_languages = ["*"]
    options.hinting = False
    options.layout_features = FEATURES
    options.glyph_names = True
    subsetter = subset.Subsetter(options)
    subsetter.populate(unicodes=codepoints)
    subsetter.subset(local)
    local.flavor = "woff2"
    asset = folder / "Archivo-PLEN-VF.woff2"
    local.save(asset)
    assert axes(original) == axes(local)
    assert set(local.getBestCmap()) == codepoints
    samples = [
        " ".join(a + b for a in LETTERS for b in LETTERS),
        "office affinity ff ffi ffl fi fl ffj staff 0123456789 £€$ 1 000 zł „Płonka” – …",
        *["".join(c if ord(c) in codepoints else " " for c in line) for line in lines],
    ]
    samples = [sample for sample in samples if sample.strip()]
    orders = [original.getGlyphOrder(), local.getGlyphOrder()]
    fonts = [hb.Font(hb.Face(sfnt(original))), hb.Font(hb.Face(sfnt(local)))]
    old_fonts = []
    if args.baseline_dir:
        for record in baseline["google_fonts"]:
            path = args.baseline_dir / Path(record["file"]).name
            assert sha(path) == record["sha256"]
            old_fonts.append(TTFont(path))
    results = []
    for location in LOCATIONS:
        for font in fonts:
            font.set_variations(location)
        for language in ["pl", "en"]:
            for features in [{}, {"tnum": True}]:
                for sample in samples:
                    assert shape(fonts[0], sample, orders[0], language, features) == shape(
                        fonts[1], sample, orders[1], language, features
                    ), (location, language, features, sample[:120])
        originals = instantiateVariableFont(original, location, inplace=False)
        locals_ = instantiateVariableFont(local, location, inplace=False)
        expected = signatures(originals, codepoints)
        assert signatures(locals_, codepoints) == expected, location
        for old in old_fonts:
            retained = codepoints & set(old.getBestCmap())
            instanced = instantiateVariableFont(old, location, inplace=False)
            assert signatures(instanced, retained) == {c: expected[c] for c in retained}
        results.append({
            "axes": location,
            "shape_strings_per_language_and_feature_set": len(samples),
            "languages": ["pl", "en"],
            "feature_sets": ["default", "tnum"],
            "shape_equal": True,
            "outline_and_hmtx_codepoints_equal": len(codepoints),
            "cached_google_outline_and_hmtx_equal": bool(old_fonts),
        })
    proof = {
        "source_url": SOURCE_URL,
        "source_sha256": SOURCE_SHA256,
        "font_version": original["name"].getDebugName(5),
        "axes_tag_min_default_max": axes(local),
        "asset_bytes": asset.stat().st_size,
        "asset_sha256": sha(asset),
        "deterministic_head_timestamp": True,
        "fonttools_version": fontTools.__version__,
        "uharfbuzz_version": hb.__version__,
        "source_files_scanned": scanned_files,
        "retained_features": FEATURES,
        "retained_codepoints": sorted(codepoints),
        "source_symbols_using_existing_fallback": sorted(seen - available - set(range(0x20))),
        "results": results,
    }
    (folder / "proof.json").write_text(json.dumps(proof, indent=2) + "\n")
    print(json.dumps({"bytes": proof["asset_bytes"], "sha256": proof["asset_sha256"], "results": results}, indent=2))


if __name__ == "__main__":
    main()
