import React, { useEffect, useState } from "react"
import { CloseIcon, Grid, Group, Text, rem } from "@mantine/core"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { IconPhoto } from "@tabler/icons-react"
import toast from "react-hot-toast"
import InputField from "../../components/Form/InputField"

export const GeneralInformationForm = ({ register, errors }) => {
  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
        <div className="w-full h-full items-center justify-center flex bg-white rounded-2xl border border-blue-100 p-4">
          <div className="flex flex-col w-full">
            <InputField label="Nombre (Obligatorio)" name="name" register={register} errors={errors} className="text-black" />
          </div>
        </div>
      </Grid.Col>
    </Grid>
  )
}
