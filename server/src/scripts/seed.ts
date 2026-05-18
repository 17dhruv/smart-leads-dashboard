import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDatabase } from "../config/db.js";
import { LeadModel } from "../models/Lead.js";
import { UserModel } from "../models/User.js";
import type { LeadSource, LeadStatus } from "../constants/lead.js";
import type { UserRole } from "../types/auth.js";

interface DemoUserInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

type DemoOwner = "admin" | "sales";

interface DemoLeadInput {
  owner: DemoOwner;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
}

const demoUsers: Record<DemoOwner, DemoUserInput> = {
  admin: {
    name: "Admin User",
    email: "admin@example.com",
    password: "password123",
    role: "admin"
  },
  sales: {
    name: "Sales User",
    email: "sales@example.com",
    password: "password123",
    role: "sales"
  }
};

const demoLeads: DemoLeadInput[] = [
  { owner: "admin", name: "Rahul Sharma", email: "rahul.sharma@example.com", status: "Qualified", source: "Instagram" },
  { owner: "admin", name: "Aisha Khan", email: "aisha.khan@example.com", status: "New", source: "Website" },
  { owner: "admin", name: "Neha Gupta", email: "neha.gupta@example.com", status: "Contacted", source: "Referral" },
  { owner: "admin", name: "Vikram Mehta", email: "vikram.mehta@example.com", status: "Lost", source: "Website" },
  { owner: "admin", name: "Priya Nair", email: "priya.nair@example.com", status: "Qualified", source: "Referral" },
  { owner: "admin", name: "Arjun Patel", email: "arjun.patel@example.com", status: "New", source: "Instagram" },
  { owner: "admin", name: "Sneha Iyer", email: "sneha.iyer@example.com", status: "Contacted", source: "Website" },
  { owner: "admin", name: "Karan Malhotra", email: "karan.malhotra@example.com", status: "Qualified", source: "Website" },
  { owner: "admin", name: "Meera Joshi", email: "meera.joshi@example.com", status: "Lost", source: "Instagram" },
  { owner: "admin", name: "Rohan Das", email: "rohan.das@example.com", status: "New", source: "Referral" },
  { owner: "admin", name: "Ishita Rao", email: "ishita.rao@example.com", status: "Contacted", source: "Instagram" },
  { owner: "admin", name: "Dev Verma", email: "dev.verma@example.com", status: "Qualified", source: "Website" },
  { owner: "sales", name: "Ananya Singh", email: "ananya.singh@example.com", status: "New", source: "Website" },
  { owner: "sales", name: "Kabir Sethi", email: "kabir.sethi@example.com", status: "Contacted", source: "Instagram" },
  { owner: "sales", name: "Tanya Kapoor", email: "tanya.kapoor@example.com", status: "Qualified", source: "Referral" },
  { owner: "sales", name: "Manav Bansal", email: "manav.bansal@example.com", status: "Lost", source: "Website" },
  { owner: "sales", name: "Sara Thomas", email: "sara.thomas@example.com", status: "New", source: "Instagram" },
  { owner: "sales", name: "Nikhil Jain", email: "nikhil.jain@example.com", status: "Contacted", source: "Referral" },
  { owner: "sales", name: "Pooja Menon", email: "pooja.menon@example.com", status: "Qualified", source: "Website" },
  { owner: "sales", name: "Aditya Bose", email: "aditya.bose@example.com", status: "Lost", source: "Referral" },
  { owner: "sales", name: "Ritika Shah", email: "ritika.shah@example.com", status: "New", source: "Website" },
  { owner: "sales", name: "Sameer Chawla", email: "sameer.chawla@example.com", status: "Contacted", source: "Instagram" },
  { owner: "sales", name: "Lavanya Reddy", email: "lavanya.reddy@example.com", status: "Qualified", source: "Instagram" },
  { owner: "sales", name: "Harsh Agarwal", email: "harsh.agarwal@example.com", status: "Lost", source: "Website" }
];

const upsertDemoUser = async (input: DemoUserInput) => {
  const passwordHash = await bcrypt.hash(input.password, 12);

  return UserModel.findOneAndUpdate(
    { email: input.email },
    {
      $set: {
        name: input.name,
        email: input.email,
        role: input.role,
        passwordHash
      }
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true
    }
  ).orFail();
};

const seed = async () => {
  await connectDatabase();

  const admin = await upsertDemoUser(demoUsers.admin);
  const sales = await upsertDemoUser(demoUsers.sales);
  const ownerIds: Record<DemoOwner, string> = {
    admin: admin._id.toString(),
    sales: sales._id.toString()
  };
  const demoLeadEmails = demoLeads.map((lead) => lead.email);

  await LeadModel.deleteMany({
    createdBy: { $in: Object.values(ownerIds) },
    email: { $in: demoLeadEmails }
  });

  await LeadModel.insertMany(
    demoLeads.map((lead) => ({
      name: lead.name,
      email: lead.email,
      status: lead.status,
      source: lead.source,
      createdBy: ownerIds[lead.owner]
    }))
  );

  console.log(`Seeded ${Object.keys(demoUsers).length} demo users and ${demoLeads.length} demo leads.`);
  console.log("Admin login: admin@example.com / password123");
  console.log("Sales login: sales@example.com / password123");
};

seed()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    void mongoose.disconnect();
  });
