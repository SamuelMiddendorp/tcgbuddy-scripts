interface Foo{
    bar: string
}
const sayBar = (foobar: Foo) => {
    console.log(foobar.bar);
}

let fooBar = {bar: "bas"};

sayBar(fooBar);
