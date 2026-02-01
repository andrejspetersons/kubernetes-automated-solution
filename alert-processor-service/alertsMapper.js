export function mapToAlert(alerts){
    
    const alertsModelArray=alerts.map(alert=>({
        
        alertname:alert.labels.alertname,
        container_name:alert.labels.container_name,
        namespace_name:alert.labels.namespace,
        image_digest:alert.labels.image_digest,
        image_repository:alert.labels.image_repository,
        image_tag:alert.labels.image_tag,
        vulnerability_id:alert.labels.vuln_id,
        vulnerability_score:alert.labels.vuln_score,
        timestamp:alert.startsAt,
        isVulnerable:true,
        status:alert.status,
        fingerprint:alert.fingerprint,
    }))

    return alertsModelArray
}