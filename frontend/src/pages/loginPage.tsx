import LoginForm from "@/components/login";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <section className="w-full max-w-md">
        <div className="mb-8 flex flex-col gap-2 items-left">
          <h1 className="text-4xl font-semibold text-left">Login</h1>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}
