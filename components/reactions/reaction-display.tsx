interface ReactionDisplayProps {
  reactions: {
    regular: number;
    admin: number;
  };
}

export default function ReactionDisplay({ reactions }: ReactionDisplayProps) {
  return (
    <div className="flex items-center gap-3 text-sm">
      {reactions.regular > 0 && (
        <span className="flex items-center gap-1 text-gray-700">
          <span>❤️</span>
          <span>{reactions.regular}</span>
        </span>
      )}
      {reactions.admin > 0 && (
        <span className="flex items-center gap-1 text-gray-700">
          <span>⭐</span>
          <span>{reactions.admin}</span>
        </span>
      )}
      {reactions.regular === 0 && reactions.admin === 0 && (
        <span className="text-gray-500 text-sm">No reactions yet</span>
      )}
    </div>
  );
}

