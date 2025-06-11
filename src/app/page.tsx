import { useEffect } from 'react';

export default function Page() {
  useEffect(() => {
    fetch("/api/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        article: "Elon Musk has announced a new plan to expand Tesla's AI business globally...",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("GPTからの返答:", data);
      })
      .catch((err) => {
        console.error("fetchエラー", err);
      });
  }, []);

  return (
    <main>
      <h1>記事を読み込んでいます...</h1>
    </main>
  );
}
