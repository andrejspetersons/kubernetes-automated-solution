import axios from 'axios';

//get Timestamp of last image tag
export async function getLatestDockerHubImageTagDate(name) {
  const [userName,image]=name.split("/")
  const [imageName,tag=""]=image.split(":")
  const url = `https://hub.docker.com/v2/namespaces/${userName}/repositories/${imageName}/tags/?page_size=1&order=last_updated`;
  const response = await axios.get(url,{timeout:5000});
  const latestTag = response.data.results[0]
  return {
    tagName: latestTag.name,
    lastUpdated: new Date(latestTag.tag_last_pushed),
    fullImage: `${userName}/${imageName}:${latestTag.name}`
  };
}