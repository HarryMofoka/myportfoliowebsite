import { useEffect } from "react";
import { Terminal as XTerm } from "xterm";
import "xterm/css/xterm.css";
import { FitAddon } from "@xterm/addon-fit";
import {
  techStack,
  projects,
  GITHUB_PROFILE,
  NEXLINK_URL,
  PORTFOLIO_URL,
  EMAIL,
  OWNER_NAME,
  OWNER_ROLE,
  OWNER_MOTTO,
  OWNER_LOCATION,
} from "@constants";
import useWindowsStore from "@store/window";

const TerminalInput = ({ terminalRef, xtermRef, fitAddonRef, commandRef }) => {
  const isOpen = useWindowsStore((state) => state.windows.terminal?.isOpen);

  useEffect(() => {
    if (!isOpen || !terminalRef.current) return;

    let term = null;
    let fitAddon = null;
    let isOpened = false;
    let bannerShown = false;
    let printBanner = null;

    const setupHandlers = (t) => {
      const prompt = () => {
        t.write("\r\n\x1b[1;32mharry@macbook ~ %\x1b[0m ");
      };

      const println = (msg) => {
        t.write("\r\n" + msg + "\x1b[0m");
      };

      const gradientChar = (char, tVal) => {
        const colors = [
          [16, 185, 129],
          [6, 182, 212],
          [59, 130, 246],
        ];
        let r, g, b;
        if (tVal <= 0.5) {
          const f = tVal / 0.5;
          r = Math.round(colors[0][0] + (colors[1][0] - colors[0][0]) * f);
          g = Math.round(colors[0][1] + (colors[1][1] - colors[0][1]) * f);
          b = Math.round(colors[0][2] + (colors[1][2] - colors[0][2]) * f);
        } else {
          const f = (tVal - 0.5) / 0.5;
          r = Math.round(colors[1][0] + (colors[2][0] - colors[1][0]) * f);
          g = Math.round(colors[1][1] + (colors[2][1] - colors[1][1]) * f);
          b = Math.round(colors[1][2] + (colors[2][2] - colors[1][2]) * f);
        }
        return `\x1b[38;2;${r};${g};${b}m${char}`;
      };
      const gradientLine = (str) =>
        [...str].map((c, i, a) => gradientChar(c, a.length > 1 ? i / (a.length - 1) : 0)).join("") +
        "\x1b[0m";

      const bannerLines = [
        "██╗  ██╗ █████╗ ██████╗ ██████╗ ██╗   ██╗",
        "██║  ██║██╔══██╗██╔══██╗██╔══██╗╚██╗ ██╔╝",
        "███████║███████║██████╔╝██████╔╝ ╚████╔╝ ",
        "██╔══██║██╔══██║██╔══██╗██╔══██╗  ╚██╔╝  ",
        "██║  ██║██║  ██║██║  ██║██║  ██║   ██║   ",
        "╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ",
      ];
      printBanner = (terminal) => {
        if (terminal.cols >= 45) {
          bannerLines.forEach((line) => terminal.writeln(gradientLine(line)));
          bannerShown = true;
        } else {
          bannerShown = false;
        }
        terminal.write("Last login: " + new Date().toLocaleString() + " / type 'help'");
        prompt();
      };

      printBanner(t);

      t.onData((data) => {
        const code = data.charCodeAt(0);

        if (code === 13) {
          const cmd = commandRef.current.trim();
          if (cmd === "") {
            prompt();
            return;
          }

          const args = cmd.split(" ");
          const baseCmd = args[0].toLowerCase();

          switch (baseCmd) {
            case "help":
              println("\x1b[1;38;2;219;39;119m=== Available Commands ===\x1b[0m");
              println(
                "\x1b[1;38;2;16;185;129mhelp\x1b[0m      \x1b[38;2;75;85;99m- Show help message\x1b[0m",
              );
              println(
                "\x1b[1;38;2;16;185;129mabout\x1b[0m     \x1b[38;2;75;85;99m- About Harry Koena Mofoka\x1b[0m",
              );
              println(
                "\x1b[1;38;2;16;185;129mstory\x1b[0m     \x1b[38;2;75;85;99m- My journey into software\x1b[0m",
              );
              println(
                "\x1b[1;38;2;16;185;129mnexlink\x1b[0m   \x1b[38;2;75;85;99m- About Nexlink Solutions ZA\x1b[0m",
              );
              println(
                "\x1b[1;38;2;16;185;129mtechstack\x1b[0m \x1b[38;2;75;85;99m- Display tech stack\x1b[0m",
              );
              println(
                "\x1b[1;38;2;16;185;129mprojects\x1b[0m  \x1b[38;2;75;85;99m- Display flagship builds\x1b[0m",
              );
              println(
                "\x1b[1;38;2;16;185;129mwhoami\x1b[0m    \x1b[38;2;75;85;99m- Print current user\x1b[0m",
              );
              println(
                "\x1b[1;38;2;16;185;129mecho\x1b[0m      \x1b[38;2;75;85;99m- Print text\x1b[0m",
              );
              println(
                "\x1b[1;38;2;16;185;129mdate\x1b[0m      \x1b[38;2;75;85;99m- Print date/time\x1b[0m",
              );
              println(
                "\x1b[1;38;2;16;185;129mclear\x1b[0m     \x1b[38;2;75;85;99m- Clear screen\x1b[0m",
              );
              println(
                "\x1b[1;38;2;16;185;129msudo\x1b[0m      \x1b[38;2;75;85;99m- Run superuser command\x1b[0m",
              );
              break;
            case "clear":
              t.clear();
              break;
            case "echo":
              println(args.slice(1).join(" "));
              break;
            case "date":
              println(new Date().toString());
              break;
            case "whoami":
              println("\x1b[38;2;75;85;99mharry\x1b[0m");
              break;
            case "about":
              println(`\x1b[1;38;2;219;39;119m=== About ${OWNER_NAME} ===\x1b[0m`);
              println(`\x1b[1;38;2;16;185;129mName:      \x1b[38;2;75;85;99m${OWNER_NAME}\x1b[0m`);
              println(`\x1b[1;38;2;16;185;129mRole:      \x1b[38;2;75;85;99m${OWNER_ROLE}\x1b[0m`);
              println(
                `\x1b[1;38;2;16;185;129mLocation:  \x1b[38;2;75;85;99m${OWNER_LOCATION} 🇿🇦\x1b[0m`,
              );
              println(
                `\x1b[1;38;2;16;185;129mMotto:     \x1b[38;2;75;85;99m"${OWNER_MOTTO}"\x1b[0m`,
              );
              println(`\x1b[1;38;2;16;185;129mEmail:     \x1b[4;38;2;37;99;235m${EMAIL}\x1b[0m`);
              println(
                `\x1b[1;38;2;16;185;129mGitHub:    \x1b[4;38;2;37;99;235m${GITHUB_PROFILE}\x1b[0m`,
              );
              println(
                `\x1b[1;38;2;16;185;129mPortfolio: \x1b[4;38;2;37;99;235m${PORTFOLIO_URL}\x1b[0m`,
              );
              println("\x1b[1;38;2;6;182;212m\r\nBio:\x1b[0m");
              println(
                "\x1b[38;2;75;85;99mSelf-taught software developer & product builder from South Africa.\x1b[0m",
              );
              println(
                "\x1b[38;2;75;85;99mCo-founder at Nexlink Solutions ZA building local-first, AI-native,\x1b[0m",
              );
              println("\x1b[38;2;75;85;99mand offline-ready web and mobile experiences.\x1b[0m");
              println(
                "\x1b[38;2;75;85;99mTry \x1b[1;38;2;16;185;129mstory\x1b[0m\x1b[38;2;75;85;99m, \x1b[1;38;2;16;185;129mnexlink\x1b[0m\x1b[38;2;75;85;99m, \x1b[1;38;2;16;185;129mtechstack\x1b[0m\x1b[38;2;75;85;99m, or \x1b[1;38;2;16;185;129mprojects\x1b[0m\x1b[38;2;75;85;99m.\x1b[0m",
              );
              break;
            case "story":
              println("\x1b[1;38;2;219;39;119m=== Journey Into Technology ===\x1b[0m");
              println(
                "\x1b[1;38;2;6;182;212m• Age ~10:\x1b[0m \x1b[38;2;75;85;99mSparked by gaming & the Samsung Galaxy Pocket Neo.\x1b[0m",
              );
              println(
                "\x1b[1;38;2;6;182;212m• First Code:\x1b[0m \x1b[38;2;75;85;99mA Visual Basic .NET Windows app that summed two numbers.\x1b[0m",
              );
              println(
                "\x1b[1;38;2;6;182;212m• 2017–2021:\x1b[0m \x1b[38;2;75;85;99mMatric at General Smuts High School.\x1b[0m",
              );
              println(
                "\x1b[1;38;2;6;182;212m• 2022–2025:\x1b[0m \x1b[38;2;75;85;99mSedibeng TVET College (NCV L3 IT — paused due to finances, kept building).\x1b[0m",
              );
              println(
                "\x1b[1;38;2;6;182;212m• WeThinkCode_:\x1b[0m \x1b[38;2;75;85;99mSocial Employment Fund, SE Prospect Programme & Generative AI.\x1b[0m",
              );
              println(
                "\x1b[1;38;2;6;182;212m• 2025–Now:\x1b[0m \x1b[38;2;75;85;99mCo-founded Nexlink Solutions ZA & shipped 41+ public GitHub repos.\x1b[0m",
              );
              break;
            case "nexlink":
              println("\x1b[1;38;2;219;39;119m=== Nexlink Solutions ZA ===\x1b[0m");
              println(
                "\x1b[1;38;2;16;185;129mRole:    \x1b[38;2;75;85;99mCo-founder & Software Developer (2025 – Present)\x1b[0m",
              );
              println(
                `\x1b[1;38;2;16;185;129mWebsite: \x1b[4;38;2;37;99;235m${NEXLINK_URL}\x1b[0m`,
              );
              println(
                "\x1b[38;2;75;85;99mBuilding web apps, mobile tools, business platforms & AI software:\x1b[0m",
              );
              println(
                "\x1b[38;2;75;85;99m• GlowLink — South African beauty services marketplace\x1b[0m",
              );
              println(
                "\x1b[38;2;75;85;99m• TapShare / Scanned — Offline-first QR + NFC vCard sharing\x1b[0m",
              );
              println(
                "\x1b[38;2;75;85;99m• AI ATS Resume Builder & Analyzer — Smarter job application tools\x1b[0m",
              );
              break;
            case "sudo":
              println(
                "\x1b[31mharry is not in the sudoers file. This incident will be reported.\x1b[0m",
              );
              break;
            case "techstack":
              println("\x1b[1;38;2;219;39;119m=== Tech Stack ===\x1b[0m");
              techStack.forEach(({ category, items }) => {
                println(`\x1b[1;38;2;6;182;212m${category}:\x1b[0m`);
                println(`\x1b[38;2;75;85;99m${items.join(", ")}\x1b[0m`);
              });
              break;
            case "projects":
              println("\x1b[1;38;2;219;39;119m=== Portfolio Projects ===\x1b[0m");
              projects.forEach((proj) => {
                println(`\x1b[1;38;2;16;185;129m• ${proj.title}\x1b[0m`);
                println("\x1b[1;38;2;245;158;11mDescription:\x1b[0m");
                println(`\x1b[38;2;75;85;99m${proj.description}\x1b[0m`);
                if (proj.link) {
                  println("\x1b[1;38;2;6;182;212mLive Demo:\x1b[0m");
                  println(`\x1b[4;38;2;37;99;235m${proj.link}\x1b[0m`);
                }
                if (proj.github) {
                  println("\x1b[1;38;2;6;182;212mGitHub:\x1b[0m");
                  println(`\x1b[4;38;2;37;99;235m${proj.github}\x1b[0m`);
                }
                println("");
              });
              break;
            default:
              println(`\x1b[31mzsh: command not found: ${baseCmd}\x1b[0m`);
          }

          commandRef.current = "";
          prompt();
        } else if (code === 127 || code === 8) {
          if (commandRef.current.length > 0) {
            commandRef.current = commandRef.current.slice(0, -1);
            t.write("\b \b");
          }
        } else if (code >= 32 && code <= 126) {
          commandRef.current += data;
          t.write(data);
        }
      });
    };

    const tryInit = () => {
      if (isOpened || !terminalRef.current) return;
      const { width, height } = terminalRef.current.getBoundingClientRect();
      if (width > 0 && height > 0) {
        term = new XTerm({
          cursorBlink: true,
          fontFamily: "Menlo, Monaco, 'Courier New', monospace",
          fontSize: 14,
          lineHeight: 1.4,
          theme: {
            background: "#ffffff",
            foreground: "#333333",
            cursor: "#333333",
            selectionBackground: "#b5d5ff",
          },
        });

        fitAddon = new FitAddon();
        term.loadAddon(fitAddon);

        term.open(terminalRef.current);
        isOpened = true;

        xtermRef.current = term;
        fitAddonRef.current = fitAddon;

        try {
          fitAddon.fit();
        } catch (e) {
          console.warn("Could not fit terminal on lazy open:", e);
        }

        setupHandlers(term);
      }
    };

    tryInit();

    let resizeTimer = null;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        if (width <= 0 || height <= 0) return;
      }
      if (!isOpened) {
        tryInit();
      } else if (fitAddonRef.current) {
        try {
          fitAddonRef.current.fit();
        } catch {
          /* empty */
        }

        // Debounced banner toggle on resize
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          if (!term || !printBanner) return;
          const shouldShow = term.cols >= 45;
          if (shouldShow !== bannerShown) {
            term.reset();
            commandRef.current = "";
            printBanner(term);
          }
        }, 200);
      }
    });

    resizeObserver.observe(terminalRef.current);

    const timer = setTimeout(() => {
      if (!isOpened) {
        tryInit();
      } else if (fitAddonRef.current && terminalRef.current) {
        const { width, height } = terminalRef.current.getBoundingClientRect();
        if (width > 0 && height > 0) {
          try {
            fitAddonRef.current.fit();
          } catch {
            /* empty */
          }
        }
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      if (term) {
        term.dispose();
      }
      xtermRef.current = null;
      fitAddonRef.current = null;
    };
  }, [isOpen, commandRef, fitAddonRef, terminalRef, xtermRef]);

  return (
    <div
      ref={terminalRef}
      className="flex-1 w-full bg-white pt-4 px-4 pb-12 outline-none xterm-wrapper"
      style={{ overflow: "hidden" }}
    />
  );
};

export default TerminalInput;
