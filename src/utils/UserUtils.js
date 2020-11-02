export const UserTagColor = {
    'system_trust_legend': '#be64a5',
    'system_trust_veteran': '#be64a5',
    'system_trust_trusted': '#ff781e',
    'system_trust_known': '#64be46',
    'system_trust_basic': '#4696d2',
    'none': '#dcdcdc'
}

export function UserGrade(tags){
    if(tags === undefined || tags == null){
        return UserTagColor.none;
    }
    let tagList = tags.join('/')

    if(tagList.includes('system_trust_legend')) return UserTagColor.system_trust_legend;
    if(tagList.includes('system_trust_veteran')) return UserTagColor.system_trust_veteran;
    if(tagList.includes('system_trust_trusted')) return UserTagColor.system_trust_trusted;
    if(tagList.includes('system_trust_known')) return UserTagColor.system_trust_known;
    if(tagList.includes('system_trust_basic')) return UserTagColor.system_trust_basic;
    else return UserTagColor.none;
}