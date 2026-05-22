// server component that delays to simulate loading
export default async function DelayPage() {
  await new Promise((res) => setTimeout(res, 8000));
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h2 className="text-2xl font-semibold">Delay page loaded</h2>
    </div>
  );
}
