interface Foo{
    bar: string
}

const sayBar = (foobar: Foo) => {
    console.log(foobar.bar);
}

let fooBar = {bar: "bas"};

console.log(process .env.npm_config_port);
sayBar(fooBar);

