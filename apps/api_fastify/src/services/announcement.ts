

export async function createAnnouncement(
    data: { 
      id_owner: string,
      id_address: string,
      price: number,
      vacancy: number,
      max_people: number,
      description: string,
      title: string,
      rules: string,
      images: string[]
      sex: string,
      created_at: Date
      university: string
    }
    ){

    return data;
  
}