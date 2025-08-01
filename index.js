const express = require("express");
const morgan = require("morgan");
const fs = require("fs-extra");

const app = express();
const PORT = 3000;

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

let images = JSON.parse(fs.readFileSync("data.json", "utf-8"));

app.get("/", (req, res) => {
  const editMode = req.query.editMode && req.query.editMode.trim() !== "";

  const imagesData = images.sort((a, b) => new Date(b.date) - new Date(a.date));
  let options = {
    editMode: editMode,
    images: imagesData,
    message:
      imagesData.length === 0
        ? "Todavía no hay imágenes en tu galería. ¡Añade una ahora!"
        : `Tu galería tiene "${images.length}" imágenes`,
  };

  if (req.query.search && req.query.search.trim() !== "") {
    const searchCriteria = req.query.search.toLowerCase();
    const filteredData = imagesData.filter((img) =>
      img.title.toLowerCase().includes(searchCriteria)
    );
    options = {
      editMode: editMode,
      images: filteredData,
      search: req.query.search,
      message:
        filteredData.length === 0
          ? `No imagenes encontradas bucando: "${req.query.search}"`
          : `Tu galería tiene "${images.length}" imágenes para la busqueda "${req.query.search}"`,
    };
  }

  res.render("home.ejs", options);
});

app.get("/new-image", (req, res) => {
  res.render("add-image.ejs", {
    message: undefined,
    redirect: undefined,
    data: {
      title: undefined,
      url: undefined,
      date: undefined,
    },
  });
});

app.post("/new-image", (req, res) => {
  const { title, url, date } = req.body;

  console.log(req.body);
  if (!title || !url || title.trim() === "" || url.trim() === "") {
    return res.render("add-image.ejs", {
      message: "Please fill all fields",
      redirect: false,
      data: {
        title: title || "",
        url: url || "",
        date: date || new Date().toISOString().split("T")[0],
      },
    });
  }

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return res.render("add-image.ejs", {
      message: "URL must start with http:// or https://",
      redirect: false,
      data: {
        title: title || "",
        url: url || "",
        date: date || new Date().toISOString().split("T")[0],
      },
    });
  }
  if (title.length > 30) {
    return res.render("add-image.ejs", {
      message: "Title cannot exceed 30 characters",
      redirect: false,
      data: {
        title: title || "",
        url: url || "",
        date: date || new Date().toISOString().split("T")[0],
      },
    });
  }
  const exists = images.find((image) => image.url === url);

  if (exists) {
    return res.render("add-image.ejs", {
      message: url + " image already exist. ",
      redirect: false,
      data: {
        title: title || "",
        url: url || "",
        date: date || new Date().toISOString().split("T")[0],
      },
    });
  }

  images.push({ title, url, date });
  const imagesJson = JSON.stringify(images);
  fs.writeFileSync("data.json", imagesJson, "utf-8");

  res.render("add-image.ejs", {
    message: "Image was uploaded successfully",
    redirect: true,
  });
});

app.post("/delete-image/:id", (req, res) => {
  const imageId = req.params.url;

  images = images.filter((img) => img.title !== imageId);

  fs.writeFileSync("data.json", JSON.stringify(images, null, 2), "utf-8");

  res.redirect("/");
});

app.use((req, res) => {
  res.status(404).render("404.ejs");
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
