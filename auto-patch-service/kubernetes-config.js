import * as k8s from '@kubernetes/client-node';

const kc=new k8s.KubeConfig();
kc.loadFromDefault();
const k8sClient=kc.makeApiClient(k8s.AppsV1Api);
export default k8sClient;
