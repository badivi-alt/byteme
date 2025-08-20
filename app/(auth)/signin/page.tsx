'use client';

export default function SignInPage() {
  return (
    <main className="min-h-[60vh] grid place-items-center p-6">
      <div className="max-w-sm w-full space-y-4 text-center">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <form action="/api/auth/signin">
          <button className="px-4 py-2 rounded-md border">Continue</button>
        </form>
      </div>
    </main>
  );
}
