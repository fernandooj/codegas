import React, { useState } from 'react';
import { Box, Button, Container, CssBaseline, Divider, Grid, Typography, IconButton } from '@mui/material';
import { Snack } from "../components/snackBar";
import { addImagesTanque } from "../store/fetch-tanque";
import DeleteIcon from '@mui/icons-material/Delete';
import Image from 'next/image'
import {imagenes} from "../utils/tanques"


export default function Step2({ tanqueId }: any) {
  const [showSnack, setShowSnack] = useState(false);
  const [message, setMessage] = useState("");
  const [base64Images, setBase64Images] = useState([]); // Array to store base64 images
  const [imageSections, setImageSections] = useState<{ [key: string]: File[] }>({} as { [key: string]: File[] });


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, type: string) => {
    event.preventDefault();

    const newData = {
      images: [],
    };

    for (const [section, sectionImages] of Object.entries(imageSections)) {
      const convertedImages = await Promise.all(sectionImages.map(convertToBase64));
      // setBase64Images((prevImages) => prevImages.concat(convertedImages));
    
      const images = convertedImages.map((image, index) => ({
        mime: sectionImages[index].type,
        imagen: image,
      }));
    
      const newData: { images: { mime: string; imagen: unknown }[] } = {
        images: [],
      };
      
    }
    

    saveData(newData, type);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, type: any) => {
    const files = event.target.files;
    if (files) {
      setImageSections((prevSections) => ({
        ...prevSections,
        [type]: prevSections[type] ? prevSections[type].concat(Array.from(files)) : Array.from(files),
      }));
    }
  };

  const convertToBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const saveData = async (convertedImages: any, type: any) => {
    const { status } = await addImagesTanque(convertedImages, tanqueId, type);
    if (status) {
      setShowSnack(true);
      setMessage("Tanque Guardado con éxito");
    }
  };

  const renderImages = (section: string) => {
    const sectionImages = imageSections[section];
    if (sectionImages) {
      return sectionImages.map((image: any, index: any) => (
        <Box key={index} sx={{ display: 'inline-block', marginRight: '10px' }}>
          <Box
            sx={{
              position: 'relative',
              display: 'inline-block',
              border: '1px solid #ccc',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '5px',
            }}
          >
            <Image 
              src={URL.createObjectURL(image)} 
              alt={`Image ${index}`} 
              width={150}
              placeholder="blur"
              blurDataURL={URL.createObjectURL(image)}
            />
            <IconButton
              sx={{ position: 'absolute', top: '5px', right: '5px', backgroundColor: '#fff' }}
              onClick={() => handleImageDelete(section, index)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      ));
    }
    return null;
  };
  const handleImageDelete = (section: string, index: number) => {
    const confirmDelete = window.confirm('¿Desea eliminar esta imagen?');
    if (confirmDelete) {
      const updatedSections = { ...imageSections };
      const sectionImages = updatedSections[section];
      if (sectionImages && sectionImages.length > index) {
        sectionImages.splice(index, 1);
        setImageSections(updatedSections);
      }
    } else {
      return;
    }

   
  };
  return (
    <Container component="main">
      <CssBaseline />
      {imagenes.map(({label, value}, index) => {
        return (
          <Box
            key={value}
            sx={{
              marginTop: 8,
            }}
          >
            <Typography variant="h5" component="h6">{label}</Typography>
            <Box
              component="form"
              noValidate
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: "baseline",
                marginBottom: 2,
              }}
              onSubmit={(event) => handleSubmit(event, value)}
            >
              <Grid container xs={3} >
                <Button
                  variant="contained"
                  component="label"
                >
                  Upload File
                  <input
                    type="file"
                    hidden
                    name="imagen"
                    multiple
                    onChange={(e) => handleImageChange(e, value)}
                  />
                </Button>
              </Grid>
              <Grid container xs={3} >
                <Button type="submit" variant="contained">
                  Guardar
                </Button>
              </Grid>
            </Box>
            {renderImages(value)}
           
            {
              (imagenes.length-1)>index
              &&<Divider />
            }
            
          </Box>
        );
      })}
      <Snack show={showSnack} setShow={() => setShowSnack(false)} message={message} />
    </Container>
  );
}
