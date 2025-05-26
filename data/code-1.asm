        .org $8000           ; Start address

start:
        LDX #$00             ; Counter = 0
        LDA #$00             ; A = 0 (fib0)
        STA fib1
        LDA #$01             ; A = 1 (fib1)
        STA fib2

print_loop:
        ; Print fib1
        LDA fib1
        STA $6000            ; Output to I/O register

        ; Calculate next Fibonacci number
        LDA fib1             ; A = fib1
        CLC
        ADC fib2             ; A = fib1 + fib2
        STA temp             ; Store new value temporarily

        ; Shift values: fib2 -> fib1, temp -> fib2
        LDA fib2
        STA fib1
        LDA temp
        STA fib2

        ; Increment counter
        INX
        CPX #$10             ; Have we printed 10 numbers?
        BNE print_loop       ; If not, repeat

        BRK                  ; End program

; --- Data ---
fib1:   .byte 0
fib2:   .byte 0
temp:   .byte 0
