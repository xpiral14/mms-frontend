import React, {FC} from 'react'

type Props = {
  renderIf?: boolean
};

const Render: FC<Props> = (props) => {
  return <>
    {props?.renderIf && props.children}
  </>
}

export default Render
