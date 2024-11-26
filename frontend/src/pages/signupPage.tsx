import SignupForm from "@/components/signup";
import { Link } from "react-router-dom";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <section className="w-full max-w-md">
        <div className="mb-8 flex flex-col gap-2 items-left">
          <h1 className="text-4xl font-semibold text-left">Signup</h1>
          <p className="text-sm text-neutral-500">
            Already have an account?{" "}
            <Link to="/" className="underline underline-offset-4">
              Login
            </Link>
          </p>
        </div>
        <SignupForm />
      </section>
    </main>
  );
}
