# ButtonsGroup

Adds top & left margin to buttons

```html
<!-- default small buttons with default margin -->
<ButtonsGroup>
    <Button>Button 1</Button>
    <Button>Button 2</Button>
</ButtonsGroup>

<!-- large buttons with large margin -->
<ButtonsGroup size="large">
    <Button variant="primary" size="large">Button 1</Button>
    <Button variant="primary" size="large">Button 2</Button>
</ButtonsGroup>

```

## size
> `null` *default*  
> large  


# Examples
```html
<!-- large buttons must be wrapped with large margins -->

<!-- so as <Button variant="icon">, because of transparent area 48px -->
<ButtonsGroup size="large">
    <Button variant="icon">
        <Icon />
    </Button>
    <Button variant="icon">
        <Icon />
    </Button>
</ButtonsGroup>

```