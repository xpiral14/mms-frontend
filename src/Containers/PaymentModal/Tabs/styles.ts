import styled from 'styled-components'
import { Colors } from '@blueprintjs/core'

export const Container = styled.div`
  width: 100%;
  .license-container {
    width: 100%;
    height: 100%;
  }

  .title {
    height: 60px;
  }

  .price {
    color: ${Colors.BLUE1};
    font-size: 2rem;
  }

  .functionality-list {
    list-style-type: none;
    padding: 0;
    margin-top: 20px;
  }
`
