   import dotenv from 'dotenv';
    dotenv.config();
    import express from 'express';
    import type { Application } from "express";

    const app: Application = express();
    const port = process.env.PORT || 3000;
   
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });