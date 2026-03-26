export function filterTagStartWithVersion(tagList,major_version){
    const pattern = /^\d+\.\d+\.\d+$/
    const filterTags = tagList.filter(tag=>tag.startsWith(major_version)&&pattern.test(tag))
    return filterTags
}

export function clearCurrentImageVersion(image_name){
    const [name,version] = image_name.split(":")
    const clearVersion = version.match(/\d+\.\d+\.\d+/)
    return clearVersion.toString()
}

export function compareVersions(tagListVersion,currentVersion){
    const tagListVersionNumbers = tagListVersion.split(".") //extracting each number in version (receiver array of string numbers)
    const tagListVersionNumbersArray = tagListVersionNumbers.map(el=>Number(el))
    const currentVersionNumbers = currentVersion.split(".")
    const currentVersionNumbersArray = currentVersionNumbers.map(el=>Number(el))
    for (let i = 0; i < 3; i++) {
        if(tagListVersionNumbersArray[i]>currentVersionNumbersArray[i]) return 1
        if(tagListVersionNumbersArray[i]<currentVersionNumbersArray[i]) return -1
    }

    return 0
}

export function buildNewImage(image_name,newImageTag){
    const [name,oldImageTag] = image_name.split(":")
    return name + ":"+newImageTag
}