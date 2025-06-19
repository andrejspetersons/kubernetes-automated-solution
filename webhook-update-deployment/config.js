import * as k8s from '@kubernetes/client-node';
const kubeClient=new k8s.KubeConfig();
kubeClient.loadFromDefault();

export const k8sApi=kubeClient.makeApiClient(k8s.AppsV1Api)