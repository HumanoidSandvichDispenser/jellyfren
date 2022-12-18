((web-mode . ((eval . (lsp))
              (lsp-enabled-clients . nil)))
 (typescript-mode . ((lsp-enabled-clients . '(ts-ls typescript typescript-language-server))
                     (lsp-disabled-clients . '("vue-semantic-server")))))
