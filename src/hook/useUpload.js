import { useState } from 'react'
import { uploadFile } from '../api/guru/upload'
import { resizeFile } from '../components/Editor'
import useToast from './useToast'
import axios from '../api/axiosClient'
import { useZUStore } from '../zustand/zustore'

function useUploadFile() {
  const { profile } = useZUStore((state) => state)
	const [isLoading, setIsLoading] = useState(false)
  const { warningToast } = useToast();

	const upload = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      if (input !== null && input.files !== null) {
        setIsLoading(true)
        const file = input.files[0];
        const image = await resizeFile(file)
  
        console.log('file', file)
        console.log('image', image)
        try {
          const res = await uploadFile(image)
  
          const url = res.data.url

          if(profile.user.image !== 'NULL' || !profile.user.image) {
            console.log('ada')
            const parts = profile.user.image.split('/')
            const fileName = parts[parts.length - 1];
            await axios.post('/delete/file', { path: fileName })
          }
          
          await axios.post('/santri/profile/update/image', { url })
          window.location.reload()
        } catch {
          warningToast('Gagal ubah foto!')
        } finally {
          setIsLoading(false)
        }
      }
    }
	}

	return {
		upload,
    isLoading
	}
}

export default useUploadFile;
