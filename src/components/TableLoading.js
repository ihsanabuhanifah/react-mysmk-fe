import React from "react";
import { Dimmer, Loader, Table } from "semantic-ui-react";

export function TableLoading({
  children,
  isLoading,
  data,
  count,
  messageEmpty,
}) {
  console.log(isLoading, "jalan");
  console.log(data?.length);
  return (
    <React.Fragment>
      {isLoading ? (
        <Table.Row textAlign="center">
          <Table.Cell colSpan={count} positive>
         
              <Dimmer active inverted>
                <Loader className="text-green-400" size="medium"> 
                <h3 className="font-bold text-green-400">Loading</h3>
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

