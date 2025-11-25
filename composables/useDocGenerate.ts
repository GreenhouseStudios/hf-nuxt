import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  AlignmentType, BorderStyle,
} from "docx";
import type Post from '../types/index'



const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN_X = 50;
const START_Y = 760;
const MAX_TEXT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;


export async function generateDocx(posts: Post[]) {
  const children: Paragraph[] = [];

  for (const post of posts) {
    const postOptions = post?.eventOptions;
    if (postOptions?.postType === "quote") continue;

    const title = `${post?.title}`;
    const year = `Year: ${post?.eventOptions.eventYear}`
    let image = postOptions?.thumbnail?.node?.mediaItemUrl
      ? toProxy(postOptions?.thumbnail?.node?.mediaItemUrl)
      : "";

    const tagline = `Tagline: ${postOptions?.tagline ?? "No tagline found"}`;
    const {text: content, imageUrls: contentImages} = parseContentDocx(postOptions?.content);

    // ---------- TITLE ----------
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: title,
            bold: true,
            size: 36,
          }),
        ],
        spacing: {
          after: 200,
        },
      })
    );

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: year,
            bold: true,
            size: 28
          })
        ],
        spacing: {
          after: 200,
        }
      })
    )

    // ---------- IMAGE ----------

    if (image !== "" && image !== 'Image: Expanding Covid Banner') {
      try {
        const {width: natW, height: natH} = await getImageSize(image);

        const maxW = 400;
        const maxH = 300;

        const scaleW = maxW / natW;
        const scaleH = maxH / natH;
        const scale = Math.min(1, scaleW, scaleH);

        const drawW = natW * scale;
        const drawH = natH * scale;

        const imgBuffer = await fetchImageData(image);

        if (imgBuffer) {
          children.push(
            new Paragraph({
              children: [
                new ImageRun({
                  data: imgBuffer,
                  transformation: {
                    width: drawW,
                    height: drawH,
                  },
                } as any),
              ],
              alignment: AlignmentType.LEFT,
              spacing: {before: 100, after: 200},
            })
          );
        } else {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "Image: [could not load]",
                  italics: true,
                }),
              ],
              spacing: {after: 200},
            })
          );
        }
      } catch (e) {
        console.warn("Failed to size image for DOCX:", image, e);
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "Image: [could not load]",
                italics: true,
              }),
            ],
            spacing: {after: 200},
          })
        );
      }
    } else {
      // fallback if fetch fails
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: image?.trim() || "Could not find image",
              italics: true,
            }),
          ],
          spacing: {
            after: 200,
          },
        })
      );
    }

    // ---------- TAGLINE ----------
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: tagline,
            size: 28, // ~12pt
          }),
        ],
        spacing: {
          before: 120,
          after: 200,
        },
      })
    )

    // ---------- CONTENT ----------
    const contentParagraphs = contentToParagraphs(content);
    children.push(...contentParagraphs);

    let textWritten = false;
    for (const rawUrl of contentImages) {

      if(!textWritten) {
        textWritten = true;
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'Content Images:',
                size: 28
              })
            ],
            spacing: {
              before: 120,
              after: 200
            }
          })
        )
      }
      const imgUrl = toProxy(rawUrl);

      try {
        const {width: natW, height: natH} = await getImageSize(imgUrl);

        const maxW = 400;
        const maxH = 300;

        const scaleW = maxW / natW;
        const scaleH = maxH / natH;
        const scale = Math.min(1, scaleW, scaleH);

        const drawW = natW * scale;
        const drawH = natH * scale;

        const imgBuffer = await fetchImageData(imgUrl);

        if (imgBuffer) {
          children.push(
            new Paragraph({
              children: [
                new ImageRun({
                  data: imgBuffer,
                  transformation: {
                    width: drawW,
                    height: drawH,
                  },
                } as any),
              ],
              alignment: AlignmentType.LEFT,
              spacing: {before: 100, after: 200},
            })
          );
        } else {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "Content image: [could not load]",
                  italics: true,
                }),
              ],
              spacing: {after: 200},
            })
          );
        }
      } catch (e) {
        console.warn("Failed to size content image for DOCX:", rawUrl, e);
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "Content image: [could not load]",
                italics: true,
              }),
            ],
            spacing: {after: 200},
          })
        );
      }
    }

    // ---------- DIVIDER ----------
    children.push(
      new Paragraph({
        border: {
          bottom: {
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
        spacing: {
          before: 200,
          after: 300,
        },
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,
              bottom: 400,
              left: 504,
              right: 504,
            },
          },
        },
        children,
      },
    ],
  });


  // Create the .docx blob and download it
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "events.docx";
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function toProxy(url: string): string {
  if(!url) return url;

  const path = url.replace(/^https?:\/\/leamh\.org/, '');

  return '/api/image?url=' + encodeURIComponent(path);
}


function decodeBody(input: string) {
  if (!input) return "";
  const txt = document.createElement("textarea");
  txt.innerHTML = input;
  return txt.value;
}

interface ParsedDocxContent {
  text: string;
  imageUrls: string[];
}

function parseContentDocx(raw: string | undefined | null): ParsedDocxContent {
  if (!raw) return { text: "", imageUrls: [] };

  const decoded = decodeBody(raw);


  const parser = new DOMParser();
  const doc = parser.parseFromString(decoded, "text/html");

  const imageUrls: string[] = [];

  doc.querySelectorAll("img").forEach((img) => {
    const src = img.getAttribute("src");
    if (src) imageUrls.push(src);
    img.remove();
  });

  let html = doc.body.innerHTML || "";

  html = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>\s*<p>/gi, "\n\n")
    .replace(/<\/?[^>]+>/g, "")
    .replace(/\r/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/\u00A0/g, " ")
    .trim();

  return { text: html, imageUrls };
}

function contentToParagraphs(text: string): Paragraph[] {
  if (!text) return [];

  const blocks = text.split(/\n{2,}/);
  const paragraphs: Paragraph[] = [];

  for (const block of blocks) {
    const lines = block.split(/\n/);

    const runs: TextRun[] = [];

    lines.forEach((line, index) => {
      runs.push(
        new TextRun({
          text: line,
          size: 24
        })
      );
      if (index < lines.length - 1) {
        runs.push(
          new TextRun({
            text: "",
            break: 1,
          })
        );
      }
    });

    paragraphs.push(
      new Paragraph({
        children: runs,
        spacing: {
          after: 120,
        },
      })
    );
  }

  return paragraphs;
}

async function fetchImageData(url: string): Promise<Uint8Array | null> {
  try {
    const res = await fetch(url);

    if (!res.ok) {
      console.warn("Image fetch failed:", url, res.status);
      return null;
    }

    // MUST be arrayBuffer, not text
    const buffer = await res.arrayBuffer();
    return new Uint8Array(buffer); // Word likes this format best
  } catch (e) {
    console.warn("Image fetch error:", e);
    return null;
  }
}

function getImageSize(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.onerror = (err) => reject(err);
    img.src = url;
  });
}
