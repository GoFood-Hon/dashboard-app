import { Card, Text, Image, Box } from "@mantine/core"

export function CreditCard({
  number = "4111 1111 1111 1111",
  holder = "Jane Doe",
  expires = "10/27",
  cvv = "303",
  brandLogo = "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
}) {
  return (
    <Box className="w-[350px] h-[200px] perspective">
      <Box className="relative w-full h-full transition-transform duration-500 transform-style preserve-3d hover:rotate-y-180">
        {/* FRONT */}
        <Card
          radius="lg"
          padding="lg"
          className="absolute w-full h-full bg-gradient-to-br from-slate-700 to-gray-900 text-white backface-hidden">
          <Text className="text-xl tracking-widest font-mono mb-6">{number}</Text>

          <Text size="xs" className="mb-4">
            {expires}
          </Text>

          <Box className="flex justify-between items-end h-full">
            <Text>{holder}</Text>
            <Image src={brandLogo} alt="Logo" w={60} />
          </Box>
        </Card>

        {/* BACK */}
        {/* <Card
          radius="lg"
          padding="lg"
          className="absolute w-full h-full bg-gradient-to-br from-slate-800 to-gray-900 text-white rounded-xl rotate-y-180 backface-hidden">
          <div className="bg-black h-8 w-full mb-6 rounded-sm" />
          <div className="flex items-center">
            <div className="bg-gray-400 w-full h-6 mr-2 rounded-sm" />
            <div className="bg-white text-black px-2 py-0.5 rounded-sm text-sm font-mono">{cvv}</div>
          </div>
        </Card> */}
      </Box>
    </Box>
  )
}
