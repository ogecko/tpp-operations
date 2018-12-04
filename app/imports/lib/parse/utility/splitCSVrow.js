import { _ } from 'meteor/underscore';

export function splitCSVrow(text) {
    if (! _.isString(text)) return [''];
    return text.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(s=>s.replace(/"/g,''));

/*
    Used to split a CSV row into individual fields, handling "quoted, strings"
    Regular expression explanation:
        ,               ','
        (?=             look ahead to see if there is:
            (?:             group, but do not capture (0 or more times): 
                (?:             group, but do not capture (2 times): ie anynonquote"anynonquote"
                    [^"]*          any character except: '"' (0 or more times)
                    "              '"'
                ){2}            end of grouping
            )*              end of grouping
            [^"]*          any character except: '"' (0 or more times) ie anynonquote
            $              before an optional \n, and the end of the string
        )               end of look-ahead
*/

}