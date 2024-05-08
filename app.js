import express from "express";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import lodash from "lodash";
import chalk from "chalk";

const app = express();
const PORT = process.env.PORT || 3000;

const users = [];

const getRUsers = async (nUser = 1) => {
  try {
    const { data } = await axios.get(
      `https://randomuser.me/api/?results=${nUser}`
    );
    return data.results;
  } catch (error) {
    console.error(error);
  }
};

const registerUsers = async () => {
  const randomUser = await getRUsers(4);
  randomUser.forEach((e) => {
    const u = {
      first: e.name.first,
      last: e.name.last,
      gender: e.gender,
      id: uuidv4(),
      timestamp: moment().locale("es").format("Qo MMMM YYYY HH:mm:ss"),
    };
    users.push(u);
  });
};

app.get("/", async (req, res) => {
  await registerUsers();
  const newUsers = lodash.partition(users, (item) => item.gender === "female");
  console.log(chalk.blue.bgWhite("Mujeres: "));
  newUsers[0].forEach((e) => {
    console.log(
      chalk.blue.bgWhite(
        `Nombre: ${e.first} - Apellido: ${e.last} - ID: ${e.id} - Timestamp: ${e.timestamp}`
      )
    );
  });
  console.log(chalk.blue.bgWhite("Hombres: "));
  newUsers[1].forEach((e) => {
    console.log(
      chalk.blue.bgWhite(
        `Nombre: ${e.first} - Apellido: ${e.last} - ID: ${e.id} - Timestamp: ${e.timestamp}`
      )
    );
  });
});

app.listen(PORT, () => {
  console.log(`Servidor levantado en http://localhost:${PORT}`);
});
