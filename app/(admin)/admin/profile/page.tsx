import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ProfileForm } from "./ProfileForm";

export const metadata: Metadata = { title: "Edit Profile" };

export default async function ProfilePage() {
  let profile = await prisma.profile.findFirst();

  if (!profile) {
    profile = await prisma.profile.create({
      data: {
        name: "Le Buu Tanh",
        title: "Business Analyst | Data Analyst | AI Solution Builder",
        bio: "I'm an E-commerce student with a strong background in Information Systems, Business Analysis, and Data Analytics.",
        email: "buutanh10032005@gmail.com",
        location: "Ho Chi Minh City, Vietnam",
      },
    });
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-1">Profile</h1>
        <p className="text-muted-foreground">Manage your public profile information</p>
      </div>
      <ProfileForm profile={JSON.parse(JSON.stringify(profile))} />
    </div>
  );
}
