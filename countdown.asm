        .org $6000           ; Start address

start:
        LDA #$0A             ; Start counting from 10

loop:
        STA $8000            ; Output the current number

        SEC                  ; Set carry flag before subtraction
        SBC #$01             ; Subtract 1

        BNE loop             ; If result is not zero, keep going

        STA $8000            ; Output the final 0

        BRK                  ; End program
