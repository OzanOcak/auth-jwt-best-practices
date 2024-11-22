import LoginForm from "@/components/login";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <section className="w-4/5 max-w-5xl">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-semibold">Login</h1>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}
