import React, { Component, Fragment } from 'react'
type Props = {
  greeting: string
  who: string
  allow?: boolean
}

const Greeter = (props: Props) => {
  // tslint:disable-next-line:no-magic-numbers
  return <div>{JSON.stringify(props, null, 2)}</div>
}

export class App extends Component {
  render() {
    return (
      <Fragment>
        <Greeter allow greeting="Hello" who="World" />
        {/* $ExpectError */}
        {/* tslint:disable-next-line:jsx-boolean-value */}
        <Greeter allow={true} greeting="Hello" who="World" />

        {/* $ExpectError */}
        {/* prettier-ignore */}
        <Greeter greeting="Hello" who="World" ></Greeter>
      </Fragment>
    )
  }
}
