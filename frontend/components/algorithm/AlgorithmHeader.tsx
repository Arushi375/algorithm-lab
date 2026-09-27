import AlgorithmBackButton from "./AlgorithmBackButton";

type AlgorithmHeaderProps = {
  category: string;
  title: string;
  description: string;
};

export default function AlgorithmHeader({
  category,
  title,
  description,
}: AlgorithmHeaderProps) {
  return (
    <header className="mb-8">
      <div className="mb-5">
        <AlgorithmBackButton />
      </div>

      <p className="text-sm font-medium text-blue-400">
        {category}
      </p>

      <h1 className="mt-2 text-4xl font-bold tracking-tight text-white">
        {title}
      </h1>

      <p className="mt-3 max-w-3xl text-slate-400">
        {description}
      </p>
    </header>
  );
}