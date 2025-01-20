class Message {
  content!: string
  from!: "Me" | "They";
}

interface IChat {
  name : string
  email?: string
  messages?: Message[]
}