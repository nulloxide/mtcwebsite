import Link from "next/link";
import { MountainIcon } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <MountainIcon className="h-12 w-12 text-brand-blue/30" />
      <h1 className="mt-8 text-7xl font-light text-text-primary md:text-9xl">
        404
      </h1>
      <p className="mt-4 text-lg font-light text-text-secondary">
        This page doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-brand-blue px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-accent"
      >
        Back to Home
      </Link>
    </div>
  );
}
