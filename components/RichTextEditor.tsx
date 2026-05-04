"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: true }),
      Image,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="space-y-2">
      {/* Toolbar — flat, no card */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: "Bold", action: () => editor.chain().focus().toggleBold().run() },
          { label: "Italic", action: () => editor.chain().focus().toggleItalic().run() },
          { label: "Strike", action: () => editor.chain().focus().toggleStrike().run() },
          { label: "H1", action: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
          { label: "H2", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
          { label: "Bullet", action: () => editor.chain().focus().toggleBulletList().run() },
          { label: "Ordered", action: () => editor.chain().focus().toggleOrderedList().run() },
        ].map((btn) => (
          <button
            key={btn.label}
            onClick={btn.action}
            className="px-2 py-1 text-sm border border-blue-400 text-white hover:bg-blue-600 transition"
          >
            {btn.label}
          </button>
        ))}

        <button
          onClick={() => {
            const url = prompt("Enter link URL");
            if (url) {
              editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
            }
          }}
          className="px-2 py-1 text-sm border border-blue-400 text-white hover:bg-blue-600"
        >
          Link
        </button>

       
      </div>

      {/* Editor — no card, no white */}
      <EditorContent
        editor={editor}
        className="
          min-h-[200px]
          p-3
          text-white
          bg-transparent
          border border-blue-400
          focus:outline-none
        "
      />
    </div>
  );
}
