import { useRef, useState } from "react";
import MarqueeIfOverflow from "./MarqueeIfOverflow";

function CopyIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M16 1H6a2 2 0 0 0-2 2v12h2V3h10V1zm3 4H10a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H10V7h9v14z"/>
    </svg>
  );
}
function TickIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/>
    </svg>
  );
}

export default function PromoCard({ promo }) {
  const [copied, setCopied] = useState(false);
  const liveRef = useRef(null);

  const copyToClipboard = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.error("❌ 複製失敗：", err);
        return false;
      }
    } else {
      alert("⚠️ 此瀏覽器不支援快速複製，請手動選取文字");
      return false;
    }
  };

  const handleCopy = async () => {
    if (!promo.code) return;
    const ok = await copyToClipboard(promo.code);
    if (ok) {
      setCopied(true);
      if (liveRef.current) liveRef.current.textContent = "已複製優惠碼";
      setTimeout(() => {
        setCopied(false);
        if (liveRef.current) liveRef.current.textContent = "";
      }, 1200);
    }
  };

  const hasCode = Boolean(promo.code);
  const rowColor = hasCode ? "ring-brand-200 bg-brand-50" : "ring-gray-200 bg-gray-50";

  return (
    <div className="border rounded-2xl p-4 shadow-sm hover:shadow-md transition bg-white">
      <h2 className="text-lg font-semibold line-clamp-1">{promo.store}</h2>
      <p className="mt-1 text-sm text-gray-600 min-h-[1.5rem]">{promo.description}</p>

      <span ref={liveRef} aria-live="polite" className="sr-only"></span>

      <div className={`mt-3 flex items-center justify-between rounded-xl overflow-hidden min-h-[56px] ring-1 ${rowColor}`}>
        <div className={`flex-1 min-w-0 pl-4 pr-2 py-3 ${hasCode ? "" : "text-gray-600 text-center"}`}>
          {hasCode ? (
            <MarqueeIfOverflow
              text={promo.code}
              className="font-mono tracking-widest text-xl md:text-2xl select-all"
              pps={30}
              fade={false}
            />
          ) : (
            <span>毋須輸入優惠碼</span>
          )}
        </div>

        {hasCode ? (
          <button
            onClick={handleCopy}
            className={`w-12 h-12 mx-2 my-2 font-semibold rounded-lg focus:outline-none focus-visible:ring-2 inline-flex items-center justify-center gap-2 text-white ${
              copied ? "bg-green-600 hover:bg-green-700 focus-visible:ring-green-500" : "bg-brand-600 hover:bg-brand-700 focus-visible:ring-brand-500"
            }`}
            aria-label="複製優惠碼"
            title="複製優惠碼"
          >
            {copied ? <TickIcon/> : <CopyIcon/>}
          </button>
        ) : (
          <div className="w-0 h-12 mx-0 my-2" aria-hidden="true"></div>
        )}
      </div>

      <a
        href={promo.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center justify-center w-full rounded-xl ring-1 ring-blue-100 bg-brand-50 hover:bg-brand-100 px-4 py-2 text-brand-800 font-medium"
      >
        前往網站兌換 <span className="ml-1">›</span>
      </a>

      <p className="mt-2 text-xs text-gray-500">{promo.expiry && `有效至：${promo.expiry}`}&nbsp;</p>

      <div className="mt-2 flex gap-2 flex-wrap justify-start">
        {Array.isArray(promo.tags) && promo.tags.map((tag, index) => (
          <span key={index} className="bg-gray-100 px-2 py-0.5 rounded text-xs">#{tag}</span>
        ))}
      </div>
    </div>
  );
}
