import ReelAccordion from "@/components/ReelAccordion";
import { getReels } from "@/lib/reels";

export default function ReelsResourcesPage() {
  const reels = getReels();

  return (
    <div>
      <h1 className="font-pixel text-3xl tracking-wider text-bone sm:text-5xl">
        reel resources
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-bone/70 sm:text-base">
        you commented on a reel, here&apos;s your resource. find the reel by
        name below and tap it to open everything it mentions.
      </p>

      <div className="mt-10">
        <ReelAccordion reels={reels} />
      </div>

      <p className="mt-12 font-pixel text-xs tracking-[0.2em] text-bone/45">
        new reel, new drop. check back.
      </p>
    </div>
  );
}
