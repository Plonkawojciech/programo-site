"""Configure and queue only the authorized v3 preview via Coolify's own models.

Uses existing VM administrator SSH. Creates no API token, reads no .env file,
prints no credentials. Production programo.pl and origin/main are excluded.
"""
import argparse
import json
from pathlib import Path
import re
import shlex
import subprocess
import uuid

ROOT = Path(__file__).resolve().parents[2]
SSH = ['ssh', '-i', str(Path.home() / '.ssh/netcup_rs2000'), '-o', 'BatchMode=yes',
       '-o', 'StrictHostKeyChecking=yes', '-o', 'ConnectTimeout=10', 'root@159.195.206.7']
PHP = r'''
require '/var/www/html/vendor/autoload.php';
$app=require '/var/www/html/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$i=json_decode(stream_get_contents(STDIN),true,512,JSON_THROW_ON_ERROR);
$a=App\Models\Application::where('name','programo-v3-preview')->first();
if($i['mode']==='configure'){
 $legacy=App\Models\Application::findOrFail(18);
 if($legacy->uuid!=='zn0yilwzortheihruzbdyj9c')throw new Exception('Unexpected demo host');
 if(!$a){
  $a=new App\Models\Application;
  $a->name='programo-v3-preview';
  $a->description='Functional v3 preview; isolated test inbox; no production DNS or main deployment';
  $a->destination_id=$legacy->destination_id;
  $a->destination_type=$legacy->destination_type;
  $a->environment_id=$legacy->environment_id;
  $a->source_id=0;
  $a->source_type=App\Models\GithubApp::class;
 }
 $a->git_repository='Plonkawojciech/programo-site';
 $a->git_branch='v3-ready-20261009';
 $a->git_commit_sha='HEAD';
 $a->build_pack='dockercompose';
 $a->base_directory='/';
 $a->docker_compose_location='/docker-compose.preview.yaml';
 $a->docker_compose_raw=$i['compose'];
 $a->docker_compose_domains=json_encode(['web'=>['domain'=>'https://v3.programo.pl']]);
 $a->domain_port_overrides=['web'=>3000];
 $a->ports_exposes='3000';
 $a->fqdn=null;
 $a->save();
 $a->settings->is_auto_deploy_enabled=false;
 $a->settings->is_preview_deployments_enabled=false;
 $a->settings->connect_to_docker_network=true;
 $a->settings->save();
 $v=$a->environment_variables()->firstOrNew(['key'=>'CRM_WEBHOOK_SECRET','is_preview'=>false]);
 if(!$v->exists)$v->value=bin2hex(random_bytes(32));
 $v->is_runtime=true;$v->is_buildtime=false;$v->is_literal=true;$v->save();
 $a->isConfigurationChanged(true);
 echo json_encode(['uuid'=>$a->uuid,'branch'=>$a->git_branch,'domain'=>'https://v3.programo.pl','mode'=>'configure','isolated'=>true]);
 exit;
}
if(!$a || $a->git_repository!=='Plonkawojciech/programo-site' || $a->git_branch!=='v3-ready-20261009' || $a->name!=='programo-v3-preview')throw new Exception('Unexpected preview target');
if($i['mode']==='queue'){
 if(!preg_match('/^[a-f0-9]{40}$/',$i['commit']))throw new Exception('Concrete commit required');
 $v=$a->environment_variables()->firstOrNew(['key'=>'SOURCE_COMMIT','is_preview'=>false]);
 $v->value=$i['commit'];$v->is_runtime=true;$v->is_buildtime=false;$v->is_literal=true;$v->save();
 $r=queue_application_deployment($a,$i['deployment_uuid'],commit:$i['commit'],is_api:true);
 $id=$r['deployment_uuid']??$i['deployment_uuid'];
 $d=$a->deployment_queue()->where('deployment_uuid',$id)->first();
 echo json_encode(['uuid'=>$a->uuid,'deployment'=>$id,'status'=>$d?->status,'commit'=>$d?->commit,'admission'=>$r['status']??null]);
 exit;
}
if($i['mode']==='status'){
 $d=$a->deployment_queue()->where('deployment_uuid',$i['deployment_uuid'])->first();
 echo json_encode(['uuid'=>$a->uuid,'deployment'=>$d?->deployment_uuid,'status'=>$d?->status,'commit'=>$d?->commit]);
 exit;
}
if($i['mode']==='routing'){
 $legacy=App\Models\Application::findOrFail(18);
 if($legacy->uuid!=='zn0yilwzortheihruzbdyj9c')throw new Exception('Unexpected demo host');
 $domains=explode(',',$legacy->fqdn);
 $filtered=array_values(array_filter($domains,fn($d)=>$d!=='https://v3.programo.pl'));
 if(count($domains)-count($filtered)>1)throw new Exception('Ambiguous duplicate preview domain');
 $legacy->fqdn=implode(',',$filtered);$legacy->save();
 echo json_encode(['uuid'=>$a->uuid,'oldDemoHost'=>$legacy->uuid,'removedOnlyPreviewDomain'=>count($domains)-count($filtered),'otherDomainsUnchanged'=>true,'staticContainerNotRestarted'=>true]);
 exit;
}
throw new Exception('Unknown mode');
'''

def main():
    p = argparse.ArgumentParser()
    p.add_argument('mode', choices=['configure', 'queue', 'status', 'routing'])
    p.add_argument('value', nargs='?')
    args = p.parse_args()
    data = {'mode': args.mode}
    if args.mode == 'configure':
        data['compose'] = (ROOT / 'docker-compose.preview.yaml').read_text()
    elif args.mode == 'queue':
        if not re.fullmatch(r'[a-f0-9]{40}', args.value or ''): raise ValueError('Concrete commit required')
        data.update(commit=args.value, deployment_uuid=str(uuid.uuid4()))
    elif args.mode == 'status':
        if not re.fullmatch(r'[a-zA-Z0-9_-]{8,64}', args.value or ''): raise ValueError('Invalid deployment identifier')
        data['deployment_uuid'] = args.value
    command = 'docker exec -i coolify php -r ' + shlex.quote(PHP)
    r = subprocess.run(SSH + [command], input=json.dumps(data).encode(), capture_output=True)
    if r.returncode:
        raise RuntimeError('Coolify preview operation failed; provider traces were withheld to protect credentials')
    result = json.loads(r.stdout)
    if args.mode == 'queue' and not result.get('deployment'):
        result['requestedDeployment'] = data['deployment_uuid']
    print(json.dumps(result))

if __name__ == '__main__': main()
