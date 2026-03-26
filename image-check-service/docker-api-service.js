import axios from 'axios';
import { filterTagStartWithVersion } from './image-tag-utils.js';

//get Timestamp of last image tag
/*export async function getLatestImageData(name) {
  try{
    const [userName,image]=name.split("/")
    const [imageName,tag=""]=image.split(":")
    const url = `https://hub.docker.com/v2/namespaces/${userName}/repositories/${imageName}/tags/?page_size=1&order=last_updated`;
    
    const response = await axios.get(url,{timeout:5000});
    const latestTag = response.data.results[0]
    return {
      tagName: latestTag.name,
      lastUpdated: new Date(latestTag.tag_last_pushed),
      fullImage: `${userName}/${imageName}`,
      digest: latestTag.digest
    };
  }catch(error){
    console.error("Get Latest Image Data Function Failed:",error.message||error)  
    throw error
  }
}*/

export async function getImageMinorVersionList(image_name){
  const [name,version_tag] = image_name.split(":")
  const major_version = version_tag.split(".")[0]
  try{
    let url = `https://registry.hub.docker.com/v2/repositories/library/${name}/tags?name=${major_version}.`
    let tagList = []
    while(url){
      const response = await axios.get(url, {timeout: 10000})
      const payload = response.data
      tagList.push(...payload.results.map(tag=>tag.name))
      url = payload.next
    }
    const filteredTagList = filterTagStartWithVersion(tagList,major_version)
    return filteredTagList
  }catch(error){
    console.error("Registry request failed its execution")
    throw error
  }
}

