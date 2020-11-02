exports.storeAnimalData = function (resp, arr) {
  const animals = resp.data.animals;
  animals.forEach((data) => {
    if (data.photos[0] === undefined) {
      // console.log("undefined");
    } else {
      const animal = {
        id: data.id,
        name: data.name,
        url: data.url,
        breed: data.breeds,
        age: data.age,
        sex: data.gender,
        size: data.size,
        desc: data.description,
        contact: data.contact,
        photo: data.photos,
      };
      arr.push(animal);
    }
  });
};
