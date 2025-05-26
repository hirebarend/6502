# 6502

A minimal assembler and emulator for the classic 6502 CPU — built from scratch for learning, fun, and retro computing nostalgia.

## Assembly

```asm
 start:
        LDX #$00             ; Counter = 0
        LDA #$00             ; A = 0 (fib0)
        STA fib1
        LDA #$01             ; A = 1 (fib1)
        STA fib2
```

## Tokens

```json
[
    {
        "type": "label",
        "value": "start"
    },
    {
        "type": "mnemonic",
        "value": "LDX"
    },
    {
        "type": "number",
        "value": 0
    },
    {
        "type": "mnemonic",
        "value": "LDA"
    },
    {
        "type": "number",
        "value": 0
    },
    {
        "type": "mnemonic",
        "value": "STA"
    },
    {
        "type": "literal",
        "value": "fib1"
    },
    {
        "type": "mnemonic",
        "value": "LDA"
    },
    {
        "type": "number",
        "value": 1
    },
    {
        "type": "mnemonic",
        "value": "STA"
    },
    {
        "type": "literal",
        "value": "fib2"
    }
]
```

## Contributing

We love our contributors! Here's how you can contribute:

- [Open an issue](https://github.com/hirebarend/6502/issues) if you believe you've encountered a bug.
- Make a [pull request](https://github.com/hirebarend/6502/pull) to add new features/make quality-of-life improvements/fix bugs.

<br />

<a href="https://github.com/hirebarend/6502/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=hirebarend/6502" />
</a>

## Repo Activity

![Alt](https://repobeats.axiom.co/api/embed/616bc192c7db2f2af8549094bc3a801da418e8a8.svg "Repobeats analytics image")

## License

Inspired by [Plausible](https://plausible.io/), 6502 is open-source under the MIT License. You can [find it here](https://github.com/hirebarend/6502/blob/main/LICENSE).