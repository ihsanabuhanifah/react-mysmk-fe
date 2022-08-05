import React from "react";
import { Dimmer, Loader, Table } from "semantic-ui-react";

export function TableLoading({
  children,
  isLoading,
  data,
  count,
  messageEmpty,
}) {
 
  return (
    <React.Fragment>
      {isLoading ? (
        <Table.Row textAlign="center">
          <Table.Cell colSpan={count} positive>
         
              <Dimmer active inverted>
                <Loader className="" size="medium"> 
                <h3 className="font-bold ">Loading</h3>
                </Loader>
              </Dimmer>
           
          </Table.Cell>
        </Table.Row>
      ) : data?.length === 0 ? (
        <Table.Row color textAlign="center">
          <Table.Cell colSpan={count} warning>
            <span className="font-bold">{messageEmpty}</span>
          </Table.Cell>
        </Table.Row>
      ) : (
        children
      )}
    </React.Fragment>
  );
}

