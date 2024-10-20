import * as vscode from "vscode";

let isActive = false; // 拡張機能の有効状態を管理するフラグ

export function activate(context: vscode.ExtensionContext) {
  // コマンドを登録
  let disposable = vscode.commands.registerCommand(
    "pinyin-input.toggle",
    () => {
      isActive = !isActive; // 有効/無効を切り替える
      const status = isActive ? "enabled" : "disabled";
      vscode.window.showInformationMessage(`Pinyin Input is now ${status}.`);
    }
  );

  context.subscriptions.push(disposable);

  // テキスト変更イベントリスナー
  let textChangeDisposable = vscode.workspace.onDidChangeTextDocument(
    (event) => {
      if (!isActive) return; // 拡張機能が無効時は何もしない
      if (event.contentChanges.length === 0) return;

      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      const document = event.document;
      const change = event.contentChanges[0];

      // Check if the change is a single character input
      if (change.text.length !== 1) return;

      const line = document.lineAt(change.range.start.line);
      const lineText = line.text;
      const position = change.range.start.character;

      // Convert 'v' to 'ü'
      if (change.text === "v") {
        const edit = new vscode.WorkspaceEdit();
        edit.replace(
          document.uri,
          new vscode.Range(
            change.range.start.line,
            change.range.start.character,
            change.range.start.line,
            change.range.start.character + 1
          ),
          "ü"
        );
        vscode.workspace.applyEdit(edit);
        return;
      }

      // Check for tone number input
      if (change.text >= "1" && change.text <= "4") {
        const toneNumber = parseInt(change.text);
        const beforePosition = Math.max(0, position - 10);
        const textBeforeNumber = lineText.substring(beforePosition, position);

        // Find the last pinyin syllable before the tone number
        const syllableMatch = textBeforeNumber.match(
          /([bcdfghjklmnpqrstwxyz]*[aeiouü]+(?:[aeiouü]*[bcdfghjklmnpqrstwxyz]*[aeiouü]+)*[bcdfghjklmnpqrstwxyz]*)$/i
        );

        if (syllableMatch) {
          const syllable = syllableMatch[1];
          const syllableStart = position - syllable.length;
          const newSyllable = convertSyllableWithTone(syllable, toneNumber);

          const edit = new vscode.WorkspaceEdit();
          edit.replace(
            document.uri,
            new vscode.Range(
              new vscode.Position(change.range.start.line, syllableStart),
              new vscode.Position(change.range.start.line, position + 1) // Include the tone number
            ),
            newSyllable
          );
          vscode.workspace.applyEdit(edit);
        }
      }
    }
  );

  context.subscriptions.push(textChangeDisposable);
}

function convertSyllableWithTone(syllable: string, tone: number): string {
  const vowelMap: { [key: string]: string[] } = {
    a: ["ā", "á", "ǎ", "à"],
    e: ["ē", "é", "ě", "è"],
    i: ["ī", "í", "ǐ", "ì"],
    o: ["ō", "ó", "ǒ", "ò"],
    u: ["ū", "ú", "ǔ", "ù"],
    ü: ["ǖ", "ǘ", "ǚ", "ǜ"],
    A: ["Ā", "Á", "Ǎ", "À"],
    E: ["Ē", "É", "Ě", "È"],
    O: ["Ō", "Ó", "Ǒ", "Ò"],
  };

  // Function to find all vowels in the syllable
  function findVowels(text: string): { char: string; index: number }[] {
    const vowels: { char: string; index: number }[] = [];
    for (let i = 0; i < text.length; i++) {
      if ("aeiouü".includes(text[i].toLowerCase())) {
        vowels.push({ char: text[i], index: i });
      }
    }
    return vowels;
  }

  const vowels = findVowels(syllable);
  if (vowels.length === 0) return syllable;

  // 声調記号を付ける母音を決定するルール
  let targetVowelIndex = -1;

  // 特殊な母音の組み合わせの処理
  const vowelString = vowels.map((v) => v.char).join("");

  if (vowelString.includes("a")) {
    targetVowelIndex = vowels.findIndex((v) => v.char === "a");
  } else if (vowelString.includes("A")) {
    targetVowelIndex = vowels.findIndex((v) => v.char === "A");
  } else if (vowelString.includes("e")) {
    targetVowelIndex = vowels.findIndex((v) => v.char === "e");
  } else if (vowelString.includes("E")) {
    targetVowelIndex = vowels.findIndex((v) => v.char === "E");
  } else if (vowelString.includes("ou")) {
    targetVowelIndex = vowels.findIndex((v) => v.char === "o");
  } else if (vowelString.includes("Ou")) {
    targetVowelIndex = vowels.findIndex((v) => v.char === "O");
  } else if (vowelString === "iu") {
    targetVowelIndex = vowels.findIndex((v) => v.char === "u");
  } else if (vowelString === "ui") {
    targetVowelIndex = vowels.findIndex((v) => v.char === "i");
  } else {
    // その他の場合は最後の母音に声調をつける
    targetVowelIndex = vowels.length - 1;
  }

  if (targetVowelIndex === -1) return syllable;

  const targetVowel = vowels[targetVowelIndex];
  const newVowel = vowelMap[targetVowel.char][tone - 1];

  // 元の文字列を変更
  return (
    syllable.substring(0, targetVowel.index) +
    newVowel +
    syllable.substring(targetVowel.index + 1)
  );
}

export function deactivate() {}
