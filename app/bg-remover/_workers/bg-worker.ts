import { removeBackground } from "@imgly/background-removal";

self.onmessage = async (e: MessageEvent<{ file: File }>) => {
  try {
    const { file } = e.data;

    const outputBlob = await removeBackground(file, {
      progress: (_key: string, current: number, total: number) => {
        if (total > 0) {
          const pct = Math.round((current / total) * 100);
          self.postMessage({ type: "progress", pct });
        }
      },
      model: "isnet_quint8",
    });

    self.postMessage({ type: "success", blob: outputBlob });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to process image locally.";
    self.postMessage({ type: "error", error: message });
  }
};
