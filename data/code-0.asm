; this is a comment

BRK ; this is a comment

.org $8000

start:

BRK

ASL A

ADC #$00

ADC $0000

ADC $0000, X

ADC $0000, Y

JMP ($0000)

ADC $00

ADC $00, X

LDX $00, Y

ADC ($00, X)

ADC ($00), Y

BCC $0000

LDA temp
