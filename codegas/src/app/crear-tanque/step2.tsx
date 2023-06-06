import React, { useState } from 'react';
import { Box, Button, Container, CssBaseline, Grid } from '@mui/material';
import { Snack } from "../components/snackBar";
import { fields, ano, ubicacion, propiedad, capacidad } from "../utils/tanques";
import { addImagesTanque } from "../store/fetch-tanque";

export default function Step2({ setActiveStep, tanqueId }: any) {
  const [showSnack, setShowSnack] = useState(false);
  const [message, setMessage] = useState("");
  const [base64Images, setBase64Images] = useState([]); // Array to store base64 images
  const [selectedImages, setSelectedImages] = useState([]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const convertedImages = await Promise.all(selectedImages.map(convertToBase64));
    setBase64Images(convertedImages); // Store the base64 representations

    const images = convertedImages.map((image, index) => ({
      mime: selectedImages[index].type,
      imagen: image,
    }));

    const newData = {
      images, // Pass the array of images to the server
    };

    saveData(newData);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedImages((prevImages) => prevImages.concat(Array.from(files)));
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const saveData = async (convertedImages: any) => {
    const { status } = await addImagesTanque(convertedImages, tanqueId, 'visual');
    if (status) {
      setShowSnack(true);
      setMessage("Tanque Guardado con éxito");
      // setActiveStep(2)
    }
  };

  const renderImages = () => {
    return selectedImages.map((image, index) => (
      <img key={index} src={URL.createObjectURL(image)} alt={`Image ${index}`} width={150} />
    ));
  };

  return (
    <Container component="main" maxWidth="xl">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }} maxWidth="sm">
          <Grid container spacing={2}>
            <Button
              variant="contained"
              component="label"
            >
              Upload File
              <input
                type="file"
                hidden
                name="imagen"
                multiple // Allow multiple file selection
                onChange={handleImageChange}
              />
            </Button>
          </Grid>
          <Box sx={{ mt: 3 }}>{renderImages()}</Box>
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Guardar
          </Button>
        </Box>
      </Box>
      <Snack show={showSnack} setShow={() => setShowSnack(false)} message={message} />
    </Container>
  );
}
