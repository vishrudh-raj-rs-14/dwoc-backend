import User from "../models/user.model";

const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");

const generateMockUserData = async () => {
  const mockUsers = [];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "XXXXL", "XXXXXL"];
  for (let i = 0; i < 10; i++) {
    const data = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      githubHandle: faker.internet.userName(),
      isOrg: i % 2 === 0,
      isFilled: i % 3 === 0,
      college: faker.company.name(),
      phone: getRandom(10),
      address: faker.address.streetAddress(),
      tshirtSize: sizes[Math.floor(Math.random() * sizes.length)],
      isAdmin: i === 0, // First user is an admin
      score: Math.floor(Math.random() * 100),
    };
    console.log(data);
    const user = await User.create(data);

    mockUsers.push(user);
  }

  return mockUsers;
};

export { generateMockUserData };

function getRandom(length: number) {
  return Math.floor(
    Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1),
  );
}
