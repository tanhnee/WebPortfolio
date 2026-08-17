import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ContactSection } from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Tran Le Buu Tanh for collaborations, project opportunities, or just to say hello.",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const profile = await prisma.profile.findFirst();

  return (
    <div className="pt-28 pb-20 min-h-screen">
      <ContactSection profile={profile} />
    </div>
  );
}
